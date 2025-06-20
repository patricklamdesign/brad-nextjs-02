'use server';

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { auth, signIn, signOut } from '@/auth';
import { signInFormSchema, signUpFormSchema, updateUserSchema } from '@/lib/validators';
import { hashSync } from 'bcrypt-ts-edge';
import { prisma } from '@/db/prisma';
import { formatError } from '@/lib/utilities';
import { z } from "zod";
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { PAGE_SIZE } from '@/lib/constants';


/*
  signInWithCredentials()
  signOutUser()
  signUp()
  getUserById()


  
*/

// signInWithCredentials()
export async function signInWithCredentials(prevState: unknown, formData: FormData) {

  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });
    
    await signIn('credentials', user);
    
    return ({ 
      success: true, 
      message: 'Signed in successfully' 
    });
  } catch (error) {
    if (isRedirectError(error)) throw error
    return ({ 
      success: false, 
      message: 'Invalid email or password' 
    })
  }
}

// Sign out user
export async function signOutUser() {
  await signOut();
}

// Sign up Register a new user
export async function signUp(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      confirmPassword: formData.get('confirmPassword'),
      password: formData.get('password'),
    });
    const plainPassword = user.password;
    user.password = hashSync(user.password, 10);
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn('credentials', {
      email: user.email,
      password: plainPassword,
    });

    return ({ 
      success: true, 
      message: 'User created successfully' 
    });
  } catch (error) {
    if (isRedirectError(error)) throw error
    return ({
      success: false,
      message: formatError(error)
    })
  }
}

// Get user by ID
export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { 
      id: userId 
    },
  });

  if (!user) throw new Error('User not found');
  return user;
}

export async function updateProfile(user: { name: string; email: string }) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });

    if (!currentUser) throw new Error('User not found');

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: user.name,
      },
    });

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { 
      success: false, 
      message: formatError(error) 
    };
  }
}

type getAllUsersType = {
  limit?: number;
  page: number;
  query: string;
}
export async function getAllUsers({ limit = PAGE_SIZE, page, query}: getAllUsersType) {
  const queryFilter: Prisma.UserWhereInput = {};
  
  // Filter by name or role
  if (query && query !== 'all') {
    queryFilter.OR = [
      {
        name: {
          contains: query,
          mode: 'insensitive',
        }
      },
      {
        role: {
          contains: query,
          mode: 'insensitive',
        } 
      }
    ];
  }
  
  const data = await prisma.user.findMany({
    where: queryFilter,
    orderBy: { 
      createdAt: 'desc' 
    },
    take: limit,
    skip: (page - 1) * limit,
  });

  const count = await prisma.user.count({
    where: queryFilter,
  });

  return {
    data,
    totalPages: Math.ceil(count / limit),
    totalRecords: count,
  };
}

// Delete a user ch 118
export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'User deleted successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update a user, ch 121
export async function updateUser(user: z.infer<typeof updateUserSchema>) {
  try {
    await prisma.user.update({
      where: { 
        id: user.id 
      },
      data: {
        name: user.name,
        role: user.role,
      },
    });

    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { 
      success: false, 
      message: formatError(error) 
    };
  }
}
