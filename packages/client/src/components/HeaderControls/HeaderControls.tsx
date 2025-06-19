import React, { useRef } from 'react';
import { Button } from '../Button/Button';
import { GlobalOutlined } from '@ant-design/icons';
import 'flag-icons/css/flag-icons.min.css';
import {
  LanguageModal,
  type LanguageModalRef,
} from '../LanguageModal/LanguageModal';

export const HeaderControls = (): React.JSX.Element => {
  const modalRef = useRef<LanguageModalRef>(null);

  const onLocalizationButtonClick = () => {
    modalRef.current?.open();
  };

  return (
    <div style={{ marginRight: '17px' }}>
      <Button onClick={onLocalizationButtonClick}>
        <GlobalOutlined style={{ fontSize: '32px' }} />
      </Button>
      <LanguageModal ref={modalRef} />
    </div>
  );
};
