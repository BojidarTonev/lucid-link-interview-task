import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum ModalTypes {
    AuthModal = 'AuthModal',
    AddFileModal = 'AddFileModal',
    AddDirectoryModal = 'AddDirectoryModal'
}

interface IOpenModalActionProps {
    title: string;
    subTitle?: string;
    modalType: ModalTypes | null;
}

interface ModalState {
    isOpen: boolean;
    title: string;
    subTitle: string | null;
    modalType: ModalTypes | null;
}

const initialState: ModalState = {
    isOpen: false,
    title: '',
    subTitle: '',
    modalType: null,
};

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openModal(state, action: PayloadAction<IOpenModalActionProps>) {
            state.isOpen = true;
            state.title = action.payload.title;
            state.subTitle = action.payload.subTitle || '';
            state.modalType = action.payload.modalType;
        },
        closeModal(state) {
            state.isOpen = false;
            state.title = '';
            state.subTitle = '';
            state.modalType = null;
        },
    },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;