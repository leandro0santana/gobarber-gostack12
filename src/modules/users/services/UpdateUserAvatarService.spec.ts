import AppError from "@shared/errors/AppError";

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

beforeEach(() => {
  fakeUsersRepository = new FakeUsersRepository();
  fakeStorageProvider = new FakeStorageProvider();

  updateUserAvatar = new UpdateUserAvatarService(
    fakeUsersRepository,
    fakeStorageProvider
  );
});

describe('UpdateUserAvatar', () => {
  it('should be able to update a new user avatar', async () => {

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avata.jpg',
    });

    expect(user.avatar).toBe('avata.jpg');
  });

  it('should not be able to update avatar from non existing user', async () => {
    await expect(updateUserAvatar.execute({
      user_id: 'no-existed-user',
      avatarFilename: 'avata.jpg',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avata.jpg',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avata2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avata.jpg');
    expect(user.avatar).toBe('avata2.jpg');
  });
});
