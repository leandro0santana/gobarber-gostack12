import AppError from "@shared/errors/AppError";

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

beforeEach(() => {
  fakeUsersRepository = new FakeUsersRepository();

  showProfile = new ShowProfileService(
    fakeUsersRepository
  );
});

describe('ShowProfileService', () => {
  it('should be able show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    const profile = await showProfile.execute({
      user_id: user.id,
    });

    expect(profile).toBe(user);
  });

  it('should not be able show the profile from non-existing user', async () => {
    await expect(showProfile.execute({
      user_id: 'non-existing-user',
    })).rejects.toBeInstanceOf(AppError);
  });
});
