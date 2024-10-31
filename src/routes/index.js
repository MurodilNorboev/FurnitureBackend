import { router as TodoRouter} from './todo/index.route.js';
import { router as UserRouter} from './user/user.route.js';
import { API_CONSTANTS } from '../constants/api.constant.js';

export const Routes = [ 
    { path: API_CONSTANTS.TODO, router: TodoRouter },
    { path: API_CONSTANTS.USER, router: UserRouter } 
];

