import './styles/global.css'
import clsx from 'clsx'
import Logo from './assets/logo.svg'
import { useState } from 'react'
import { RiShutDownLine } from 'react-icons/ri'

import { atom, useRecoilState } from 'recoil'
import { recoilPersist } from 'recoil-persist'
const { persistAtom } = recoilPersist()

import { Header } from './components/Header'
import SummaryTable from './components/SummaryTable'
import { AuthForm } from './components/AuthForm'

export const authState = atom({
  key: 'authState',
  default: null,
  effects_UNSTABLE: [persistAtom],
})

function Login() {
  return <div></div>
}

export function App() {
  const [auth, setAuth] = useRecoilState(authState)
  const [panel, setPanel] = useState('login')

  if (!auth) {
    return (
      <div className='flex flex-col items-center justify-center mt-12'>
        <img src={Logo} alt='' />

        <p className='mt-6 text-3xl text-violet-500'>
          Your aplication to track your habits
        </p>
        <p className=' text-violet-500 text-lg'>One Step every day</p>

        <div className='flex mt-12 space-x-12'>
          <h2
            onClick={() => setPanel('register')}
            className={clsx('text-xl font-semibold cursor-pointer', {
              'border-b-4 border-violet-500': panel === 'register',
            })}
          >
            Sign Up
          </h2>
          <h2
            onClick={() => setPanel('login')}
            className={clsx('text-xl font-semibold cursor-pointer', {
              'border-b-4 border-violet-500': panel === 'login',
            })}
          >
            Login
          </h2>
        </div>

        <div className='w-full max-w-2xl px-6 mt-12'>
          <AuthForm panel={panel} />
        </div>
      </div>
    )
  }

  return (
    <div className='flex items-center justify-center w-screen h-screen'>
      <div className='flex flex-col w-full max-w-5xl gap-16 px-6'>
        {auth ? (
          <>
          <div className='relative w-full'>
              <button
              onClick={() => setAuth(null)}
              className='relative left-[920px]'
            >
             <RiShutDownLine size={40}/>
            </button>
          </div>
            <Header />
            <SummaryTable />
          </>
        ) : (
          <Login />
        )}
      </div>
    </div>
  )
}
