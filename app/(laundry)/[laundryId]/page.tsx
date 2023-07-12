import { type FC } from "react"

type Props = {
  params: { laundryId: string }
}

const LaundryIdPage: FC<Props> = ({ params }) => {
  return <div>Laundry-id {params.laundryId}</div>
}

export default LaundryIdPage
