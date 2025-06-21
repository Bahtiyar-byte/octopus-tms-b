import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PasswordResetRequest } from 'app/security/passwordReset-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    email: yup.string().email().emptyToNull().max(100).required()
  });
}

export default function PasswordResetStart() {
  const { t } = useTranslation();
  useDocumentTitle(t('passwordReset.start.headline'));

  const navigate = useNavigate();

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const getMessage = (key: string) => {
    const messages: Record<string, string> = {
      PASSWORD_RESET_REQUEST_USERNAME_EXISTS: t('passwordReset.start.noAccount')
    };
    return messages[key];
  };

  const start = async (data: PasswordResetRequest) => {
    window.scrollTo(0, 0);
    try {
      await axios.post('/passwordReset/start', data);
      navigate('/login', {
            state: {
              msgSuccess: t('passwordReset.started')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t, getMessage);
    }
  };

  return (<>
    <h1 className="grow text-3xl md:text-4xl font-medium mb-8">{t('passwordReset.start.headline')}</h1>
    <form onSubmit={useFormResult.handleSubmit(start)} noValidate>
      <InputRow useFormResult={useFormResult} object="passwordResetRequest" field="email" required={true} type="email" />
      <input type="submit" value={t('passwordReset.start.submit')} className="inline-block text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-300  focus:ring-4 rounded px-5 py-2 mt-6" />
    </form>
  </>);
}
