export type SignUpFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};
