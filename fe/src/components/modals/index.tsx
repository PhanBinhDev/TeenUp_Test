'use client';

import useModal from '@/hooks/use-modal';
import { useEffect, useState } from 'react';
import ModalAddClass from './modal-add-class';
import { ModalRemoveClass } from './modal-confirm-delete-class';
import { ModalChangeClassStatus } from './modal-change-class-status';
import ModalUpdateClass from './modal-update-class';
import { ModalAddStudent } from './modal-add-student';
import { ModalUpdateStudent } from './modal-update-student';
import { ModalRemoveStudent } from './modal-remove-student';
import { ModalAddSubscription } from './modal-add-subscription';
import { ModalRegisterClass } from './modal-register-class';
import { ModalClassDetail } from './modal-class-detail';
import { ModalConfirmUnregister } from './modal-confirm-unregister';

const Modals = () => {
  const { isModalOpen } = useModal();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {/* Teacher modals */}
      {isModalOpen('ModalAddClass') && <ModalAddClass />}
      {isModalOpen('ModalRemoveClass') && <ModalRemoveClass />}
      {isModalOpen('ModalChangeClassStatus') && <ModalChangeClassStatus />}
      {isModalOpen('ModalUpdateClass') && <ModalUpdateClass />}

      {/* Parent modals */}
      {isModalOpen('ModalAddStudent') && <ModalAddStudent />}
      {isModalOpen('ModalUpdateStudent') && <ModalUpdateStudent />}
      {isModalOpen('ModalRemoveStudent') && <ModalRemoveStudent />}
      {isModalOpen('ModalAddSubscription') && <ModalAddSubscription />}
      {isModalOpen('ModalRegisterClass') && <ModalRegisterClass />}
      {isModalOpen('ModalClassDetail') && <ModalClassDetail />}
      {isModalOpen('ModalConfirmUnregister') && <ModalConfirmUnregister />}
    </>
  );
};

export default Modals;
