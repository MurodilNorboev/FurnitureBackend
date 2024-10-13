import { router as TodoRouter} from './todo/index.route.js';
import { TODO } from '../constants/api.constant.js';

export const Routes = [ { path: TODO, router: TodoRouter } ];

