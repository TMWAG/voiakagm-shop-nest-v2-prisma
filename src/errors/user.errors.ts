export const UserError = {
  notUnique: {
    phone: 'Пользователь с таким номером телефона уже зарегистрирован',
    email: 'Пользователь с таким адресом электронной почты уже зарегистрирован',
  },
  noData: {
    phoneOrPassword: 'Не указанны данные для входа',
    empty: 'Данные не указаны',
    noUserId: 'id пользователя не указано',
    noRoleId: 'id роли не указано',
  },
  wrong: {
    email: 'Указанна неверная почта',
    prone: 'Указан неверный номер телефона',
    password: 'Указан неверный пароль',
  },
  notFound: {
    user: {
      id: 'Пользователь с таким id не найден',
      email: 'Пользователь с таким email не найден',
      phone: 'Пользователь с таким телефоном не найден',
      token: 'Пользователь с таким токеном не найден',
    },
  },
};
