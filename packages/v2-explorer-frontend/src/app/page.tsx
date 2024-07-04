import Image from "next/image";
import { Main } from './pages/Main'

export const getServerSidePropsHome = async () => {
  return {
    data: 'some data'
  }
}

export default async function Index() {
  const props = await getServerSidePropsHome()
  return (
    <Main props={props} />
  );
}
