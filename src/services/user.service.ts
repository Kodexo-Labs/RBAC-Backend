import { User } from '../entities/user.entity';
import { CreateUserInput } from '../schemas/user.schema';
import { AppDataSource } from '../utils/data-source';
import config from 'config';
import { signJwt } from '../utils/jwt';

const userRepository = AppDataSource.getRepository(User);

export const createUser = async (input: CreateUserInput) => {
  return (await AppDataSource.manager.save(
    AppDataSource.manager.create(User, input)
  )) as User;
};

export const getAllUsers = async () => {
  return await userRepository.find({
    relations: {
      role: true,
    },
  });
}

export const deleteUser = async(userId: string) => {
  return await AppDataSource.createQueryBuilder()
    .delete()
    .from(User, 'user')
    .where('id = :id', {id: userId})
    .execute()
}

export const findUserByEmail = async ({ email }: { email: string }) => {
  return await userRepository.findOneBy({ email });
};

export const findUserById = async (userId: string) => {
  return await userRepository.findOne({where: {id: userId}, relations: {role: true}});
};

export const findUser = async (query: Object) => {
  return await userRepository.findOneBy(query);
};

// ? Sign access and Refresh Tokens
export const signTokens = async (user: User) => {
    // 2. Create Access and Refresh tokens
    const access_token = signJwt({ sub: user.id }, 'accessTokenPrivateKey', {
      expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
    });
  
    const refresh_token = signJwt({ sub: user.id }, 'refreshTokenPrivateKey', {
      expiresIn: `${config.get<number>('refreshTokenExpiresIn')}m`,
    });
    
    return { access_token, refresh_token };
  };
