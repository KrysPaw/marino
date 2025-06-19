import { forwardRef, useImperativeHandle, useState } from 'react';
import { Modal } from '../Modal/Modal';
import { Button } from '../Button/Button';
import {
  StyledLanguageList,
  StyledLanguageOption,
} from './LanguageModal.styled';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useT } from '../../hooks/useT';

const languages = [
  { code: 'pl', name: 'Polski', flag: 'fi fi-pl' },
  { code: 'en', name: 'English', flag: 'fi fi-gb' },
  // Add more languages as needed
];

// Define the type for the ref, assuming LanguageModal exposes an 'open' method
export type LanguageModalRef = {
  open: () => void;
};

export const LanguageModal = forwardRef(({}, ref): React.JSX.Element => {
  const [isModalOpen, setModalOpen] = useState(false);
  const t = useT();
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  useImperativeHandle(
    ref,
    (): LanguageModalRef => ({
      open: () => setModalOpen(true),
    })
  );

  return (
    <Modal
      title={t('language.title')}
      isOpen={isModalOpen}
      onCloseClick={() => setModalOpen(false)}
    >
      <StyledLanguageList>
        {languages.map((language) => (
          <Button
            key={language.code}
            minWidth="100%"
            keepSpaceForIcon
            icon={language.code === currentLanguage && <CheckCircleOutlined />}
            onClick={() => i18n.changeLanguage(language.code)}
          >
            <StyledLanguageOption>
              <span className={language.flag}></span>
              {language.name}
            </StyledLanguageOption>
          </Button>
        ))}
      </StyledLanguageList>
    </Modal>
  );
});
