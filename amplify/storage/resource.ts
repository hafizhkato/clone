import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'UserStorage',
  access: (allow) => ({
    'profile-pictures/{entity_id}/*': [
      allow.guest.to(['read']),
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],
    'picture-submissions/*': [
      allow.authenticated.to(['read','write', 'delete']),
      allow.guest.to(['read'])
    ],
}),
});