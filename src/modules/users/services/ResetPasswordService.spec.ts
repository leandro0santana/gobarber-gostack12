import AppError from "@shared/errors/AppError";

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUsersTokensRepository from '../repositories/fakes/FakeUsersTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUsersTokensRepository: FakeUsersTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

describe('ResetPasswordService', () => {
  beforeEach(() => {
  fakeUsersRepository = new FakeUsersRepository();
  fakeUsersTokensRepository = new FakeUsersTokensRepository();
  fakeHashProvider = new FakeHashProvider();


  resetPassword = new ResetPasswordService(
    fakeUsersRepository,
    fakeUsersTokensRepository,
    fakeHashProvider
    );

  });

  it('should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    const { token } = await fakeUsersTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPassword.execute({
      password: '456789',
      token,
    });

    const upadateUser = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('456789')
    expect(upadateUser?.password).toBe('456789');
  });

  it('should not be able to reset the password with non-existing token', async () => {
    await expect(resetPassword.execute({
      token: 'non-existing-token',
      password: '456789',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with non-existing user', async () => {
    const { token } = await fakeUsersTokensRepository.generate('non-existing');

    await expect(resetPassword.execute({
      token,
      password: '456789',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password passed more than 2 hours', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    const { token } = await fakeUsersTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours()+3);
    });

    await expect(resetPassword.execute({
      token,
      password: '456789'
    })).rejects.toBeInstanceOf(AppError);
  });
});
