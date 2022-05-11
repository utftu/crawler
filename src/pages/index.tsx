import type { NextPage } from 'next'
import Input from "../components/input";
import {useFfw, useInitFfw} from "ffw";
import * as yup from 'yup'


const Home: NextPage = () => {
  const ffw = useInitFfw({
    validateSchema: yup.object({
      url: yup.string().required(),
      maxDepth: yup.number().required(),
      maxRequests: yup.number().required()
    }).required()
  })
  useFfw({
    form: ffw
  })
  return (
    <div className={'flex justify-center'}>
      <div  className={'max-w-md p-6'}>
        <Input label={{label: 'Url', error: ffw.f.url.error}} input={{...ffw.f.url.getInput()}}/>
        <Input className={'mt-8'} label={{label: 'Max depth', error: ffw.f.maxDepth.error}} input={{...ffw.f.maxDepth.getInput()}}/>
        <Input className={'mt-8'} label={{label: 'Max requests', error: ffw.f.maxRequests.error}} input={{...ffw.f.maxRequests.getInput()}}/>
      </div>
    </div>
  )
}

export default Home
