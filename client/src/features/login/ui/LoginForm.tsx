import { type SubmitEvent, useState } from 'react';
import s from './LoginForm.module.css';
import { Input } from '../../../shared/ui/input/Input';
import { Button } from '../../../shared/ui/button/Button';
import { useSignInMutation, useSignUpMutation } from '../lib/useLogin';
import { getReadableErrorMessage } from '../../../shared/utils/getReadableErrorMessage';
import { getIssueMessage, LoginSchema, RegisterSchema } from '@research/shared';

export const LoginForm = () => {
  const [isAccount, setIsAccount] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorLocale, setErrorLocale] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setErrorLocale('');
  };

  const {
    reset: resetSignIn,
    mutate: signIn,
    error: signInError,
    isError: isSignInError,
    isPending: isSignInPending,
  } = useSignInMutation(resetForm);
  const {
    reset: resetSignUp,
    mutate: signUp,
    error: signUpError,
    isError: isSignUpError,
    isPending: isSignUpPending,
  } = useSignUpMutation(resetForm);

  const serverError = isSignUpError ? signUpError : isSignInError ? signInError : null;
  const error = serverError ? getReadableErrorMessage(serverError) : errorLocale ? errorLocale : '';

  const isPending = isSignUpPending || isSignInPending;

  const onSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const schema = isAccount ? LoginSchema : RegisterSchema;
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      setErrorLocale(getIssueMessage(parsed.error));
      return;
    }

    if (isAccount) signIn(parsed.data);
    else signUp(parsed.data);
  };

  const toggleAccountMode = () => {
    resetSignUp();
    resetSignIn();
    setErrorLocale('');
    setIsAccount(prev => !prev);
  };

  const onEmailInput = (value: string) => {
    resetSignUp();
    resetSignIn();
    setErrorLocale('');
    setEmail(value);
  };

  const onPasswordInput = (value: string) => {
    resetSignUp();
    resetSignIn();
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
