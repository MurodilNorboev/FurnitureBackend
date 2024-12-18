import { router as TodoRouter} from './todo/index.route.js';
import { router as UserRouter} from './user/user.route.js';
import { router as FurnitureRouter} from './todo/index.route.js';
import { API_CONSTANTS } from '../constants/api.constant.js';
import { UploadRouter } from './upload/upload.router.js';
import { router as EventRouter} from './Admin/event.users.js';
import { router as SessionRouter } from './Admin/session.user.js';
import { router as ProductsRouter} from './Admin/products.router.js';

export const Routes = [ 
    { path: API_CONSTANTS.TODO, router: TodoRouter },
    { path: API_CONSTANTS.USER, router: UserRouter },
    { path: API_CONSTANTS.UPLOAD, router: UploadRouter },
    { path: API_CONSTANTS.SESSIONS, router: SessionRouter },
    { path: API_CONSTANTS.EVENT, router: EventRouter },
    { path: API_CONSTANTS.USERFUR, router: FurnitureRouter },
    { path: API_CONSTANTS.PRODUCTS, router: ProductsRouter },
];

