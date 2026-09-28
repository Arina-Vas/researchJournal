import { type SubmitEvent, useState } from 'react';
import s from './LoginForm.module.css';
import { Input } from '../../../shared/ui/input/input';
import { Button } from '../../../shared/ui/button/Button';

export const LoginForm = () => {
  const [isAccount, setIsAccount] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorLocale, setErrorLocale] = useState('');

  // const resetForm = () => {
  //   setEmail('');
  //   setPassword('');
  //   setErrorLocale('');
  // };
  // const {
  //   mutate: signUp,
  //   error: signUpError,
  //   isError: isSignUpError,
  //   isPending: isSignUpPending,
  // } = useSignUpMutation(resetForm);
  // const {
  //   mutate: signIn,
  //   error: signInError,
  //   isError: isSignInError,
  //   isPending: isSignInPending,
  // } = useSignInMutation(resetForm);

  // const serverError = null;
  // const serverError = isSignUpError ? signUpError : isSignInError ? signInError : null;
  const error = '';
  // const error = serverError ? serverError.message : errorLocale ? errorLocale : '';

  const isPending = false;
  // const isPending = isSignUpPending || isSignInPending;

  const isFormValid = () => {
    if (!email.trim() && !password.trim()) {
      setErrorLocale('Please enter valid data');
      return false;
    }
    if (!email.trim()) {
      setErrorLocale('Please enter a valid email');
      return false;
    }
    if (!password.trim()) {
      setErrorLocale('Please enter a password');
      return false;
    }
    return true;
  };

  const onSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorLocale('');
    if (!isFormValid()) return;

    if (isAccount) {
      console.log({ email, password });
    } else console.log({ email, password });
  };

  const toggleAccountMode = () => {
    setIsAccount(prev => !prev);
  };

  const onEmailInput = (value: string) => {
    setErrorLocale('');
    setEmail(value);
  };

  const onPasswordInput = (value: string) => {
    setErrorLocale('');
    setPassword(value);
  };

  return (
    <div className={s.formWrapper}>
      <form onSubmit={onSubmit} className={s.form}>
        <Input
          autoComplete="email"
          id={'email'}
          label={'Email: '}
          isError={!!errorLocale}
          onChange={onEmailInput}
          placeholder={'Enter your email'}
          value={email}
        />
        <Input
          id={'password'}
          label={'Password: '}
          isError={!!errorLocale}
          onChange={onPasswordInput}
          placeholder={'Enter your password'}
          value={password}
          type={'password'}
          autoComplete={isAccount ? 'current-password' : 'new-password'}
        />
        <span className={s.errorContent}>{error}</span>
        <Button isLoading={isPending} disabled={!email || !password} type={'submit'}>
          {isAccount ? 'Sign in' : 'Sign up'}
        </Button>
      </form>
      <div>
        <span>{isAccount ? "Don't have an account? " : 'Already have an account? '}</span>
        <Button variant={'text'} onClick={toggleAccountMode} type={'button'}>
          {isAccount ? 'Sign up' : 'Sign in'}
        </Button>
      </div>
    </div>
  );
};
