import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import PendingIcon from '@mui/icons-material/Pending';

const compatibleIcons = {
  'yes': <CheckOutlinedIcon className='compatible-icon' sx={{color: 'green'}}/>,
  'no': <ClearOutlinedIcon className='noncompatible-icon' sx={{color: 'red'}}/>,
  'maybe': <ReportProblemOutlinedIcon className='mcompatible-icon' sx={{color: 'yellow'}}/>,
  'pending': <PendingIcon className='pcompatible-icon' sx={{color: "yellow"}}/>
}

export default compatibleIcons;