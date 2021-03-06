import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'
import CreateAppointmentService from './CreateAppointmentService';


let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

beforeEach(() => {
  fakeAppointmentsRepository = new FakeAppointmentsRepository();

  createAppointment = new CreateAppointmentService(
    fakeAppointmentsRepository
  );

});

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '12415641514',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('12415641514');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2020, 4, 10, 11);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '12415641514',
    });

    await expect(createAppointment.execute({
      date: appointmentDate,
      provider_id: '12415641514',
    })).rejects.toBeInstanceOf(AppError);
  });
});
