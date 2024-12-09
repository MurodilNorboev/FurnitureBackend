import { router as TodoRouter} from './todo/index.route.js';
import { router as UserRouter} from './user/user.route.js';
import { router as EventRouter} from './event/index.event.router.js';
import { API_CONSTANTS } from '../constants/api.constant.js';
import { UploadRouter } from './upload/upload.router.js';

export const Routes = [ 
    { path: API_CONSTANTS.TODO, router: TodoRouter },
    { path: API_CONSTANTS.EVENT, router: EventRouter },
    { path: API_CONSTANTS.USER, router: UserRouter },
    { path: API_CONSTANTS.UPLOAD, router: UploadRouter },
];

