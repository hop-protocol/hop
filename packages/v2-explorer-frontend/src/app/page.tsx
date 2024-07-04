import Image from "next/image";
// import styles from "./page.module.css";
import { Main } from './src/main'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'

export const getServerSidePropsHome = async () => {
  // Pass data to the page via props
  return {
    props: {
      data: 'some data'
    },
  }
}

export default async function Home() {
  const props = await getServerSidePropsHome()
  return (
    <Main props={props} />
  );
}
