import type { NextPage } from 'next'
import Input from "../components/input";
import {useFfw, useInitFfw} from "ffw";
import * as yup from 'yup'
import {Button} from "baseui/button";
import {getLinks} from "../conections/crawler";
import {useState} from "react";
import {ListItem, ListItemLabel} from "baseui/list";
import {Check, Search} from "baseui/icon";
import Show from "../components/show";
import {DisplayXSmall} from "baseui/typography";


const Home: NextPage = () => {
  const [links, setLinks] = useState([])
  // const [{startTime, endTime}, setTime] = useState({})
  const [startTime, setStartTime] = useState('')
  const [finishTime, setFinishTime] = useState('')
  const ffw = useInitFfw({
    validateSchema: yup.object({
      url: yup.string().required(),
      maxDepth: yup.number().max(4).required(),
      maxRequests: yup.number().max(40).required()
    }).required(),
    async onSubmit(ffw) {
      setStartTime(new Date().toISOString())
      setFinishTime('waiting')
      setLinks([])
      const links = await getLinks(encodeURIComponent(ffw.f.url.value), ffw.f.maxDepth.value, ffw.f.maxRequests.value)
      setFinishTime(new Date().toISOString())
      setLinks(links)
    }
  })
  useFfw({
    form: ffw
  })
  return (
    <div className={'flex justify-center'}>
      <div  className={'grow max-w-md p-6 flex flex-col'}>
        <Input label={{label: 'Url', error: ffw.f.url.error}} input={{...ffw.f.url.getInput()}}/>
        <Input className={'mt-8'} label={{label: 'Max depth', error: ffw.f.maxDepth.error}} input={{...ffw.f.maxDepth.getInput()}}/>
        <Input className={'mt-8'} label={{label: 'Max requests', error: ffw.f.maxRequests.error}} input={{...ffw.f.maxRequests.getInput()}}/>
        <Button
          className={'mt-8'}
          onClick={ffw.submit}
        >
          Search
        </Button>
        <Show show={links.length}>
          <div className={'pt-16 flex flex-col gap-2'}>
            <DisplayXSmall className={'self-center'}>
              Links
            </DisplayXSmall>
            <div>

            </div>
            <div>
              Count {links.length}
            </div>
            <div>
              Start time: {startTime}
            </div>
            <div>
              Finish time: {finishTime}
            </div>
            <ul>
              {links.map((link) => {
                return (
                  <ListItem
                    artwork={props => <Check {...props} />}
                  >
                    <ListItemLabel key={link}>{link}</ListItemLabel>
                  </ListItem>
                )
              })}
            </ul>
          </div>
        </Show>
      </div>
    </div>
  )
}

export default Home
