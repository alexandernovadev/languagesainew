import type { User } from '@/services/userService';
import { createCRUDUIStore } from './createCRUDUIStore';

export const useUsersUIStore = createCRUDUIStore<User>('users-ui-store');
