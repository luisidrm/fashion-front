'use client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '@/store'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <I18nextProvider i18n={i18n}>
          {children}
        </I18nextProvider>
      </PersistGate>
    </Provider>
  )
}