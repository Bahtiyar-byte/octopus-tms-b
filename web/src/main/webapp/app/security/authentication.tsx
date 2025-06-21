import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AuthenticationRequest } from 'app/security/authentication-model';
import axios from 'axios';
import useAuthentication from 'app/security/use-authentication';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    username: yup.string().email().emptyToNull().max(100).required(),
    password: yup.string().emptyToNull().max(72).required()
  });
}

export default function Authentication() {
  const { t } = useTranslation();
  useDocumentTitle(t('authentication.login.headline'));

  const navigate = useNavigate();
  const authenticationContext = useAuthentication();

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const login = async (data: AuthenticationRequest) => {
    window.scrollTo(0, 0);
    try {
      const response = await axios.post('/authenticate', data);
      navigate(authenticationContext.login(response.data));
    } catch (error: any) {
      if (error.status === 401) {
        useFormResult.reset();
        navigate('/login', {
              state: {
                msgError: t('authentication.login.error')
              }
            });
        return;
      }
      handleServerError(error, navigate, useFormResult.setError, t);
    }
  };

  return (<>
    <h1 className="grow text-3xl md:text-4xl font-medium mb-8">{t('authentication.login.headline')}</h1>
    <form onSubmit={useFormResult.handleSubmit(login)} noValidate>
      <InputRow useFormResult={useFormResult} object="authentication" field="username" required={true} type="email" />
      <InputRow useFormResult={useFormResult} object="authentication" field="password" required={true} type="password" />
      <input type="submit" value={t('authentication.login.headline')} className="inline-block text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-300  focus:ring-4 rounded px-5 py-2 mt-6" />
    </form>
    <p className="mt-12">
      <span>{t('authentication.resetPasswort.text')}</span>
      <span> </span>
      <Link to="/passwordReset/start" className="underline">{t('authentication.resetPasswort.link')}</Link>
    </p>
  </>);
}
