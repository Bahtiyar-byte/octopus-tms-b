import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleServerError, setYupDefaults } from '../utils/common';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PasswordResetCompleteRequest } from './passwordReset-model';
import axios from 'axios';
import InputRow from '../components/forms/InputRow';
import useDocumentTitle from '../hooks/useDocumentTitle';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    newPassword: yup.string().emptyToNull().max(255).required()
  });
}

export default function PasswordResetComplete() {
  const { t } = useTranslation();
  useDocumentTitle(t('passwordReset.complete.headline'));

  const navigate = useNavigate();
  const [searchParams, ] = useSearchParams();
  const passwordResetUid = '' + searchParams.get('uid');

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const isValidUid = async () => {
    try {
      const response = await axios.get('/passwordReset/isValidUid', { params: { uid: passwordResetUid } });
      if (response.data !== true) {
        navigate('/login', {
              state: {
                msgError: t('passwordReset.invalid')
              }
            });
      }
    } catch (error) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    isValidUid();
  }, []);

  const complete = async (data: PasswordResetCompleteRequest) => {
    window.scrollTo(0, 0);
    try {
      data.uid = passwordResetUid;
      await axios.post('/passwordReset/complete', data);
      navigate('/login', {
            state: {
              msgSuccess: t('passwordReset.completed')
            }
          });
    } catch (error) {
      handleServerError(error, navigate, useFormResult.setError, t);
    }
  };

  return (<>
    <h1 className="grow text-3xl md:text-4xl font-medium mb-8">{t('passwordReset.complete.headline')}</h1>
    <form onSubmit={useFormResult.handleSubmit(complete)} noValidate>
      <InputRow useFormResult={useFormResult} object="passwordResetCompleteRequest" field="newPassword" required={true} type="password" />
      <input type="submit" value={t('passwordReset.complete.submit')} className="inline-block text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-300  focus:ring-4 rounded px-5 py-2 mt-6" />
    </form>
  </>);
}
