import { router as TodoRouter} from './todo/index.route.js';
import { API_CONSTANTS } from '../constants/api.constant.js';

export const Routes = [ { path: API_CONSTANTS.TODO, router: TodoRouter } ];

