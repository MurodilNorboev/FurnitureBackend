import { router as TodoRouter} from './todo/index.route.js';
import { router as UserRouter} from './user/user.route.js';
import { API_CONSTANTS } from '../constants/api.constant.js';
import { UploadRouter } from './upload/upload.router.js';
import { router as UserFurRouter} from './Admin/admin.users.js';
import { router as FurnitureRouter} from './Admin/products.router.js';
import { router as ProductsRouter} from './Admin/products.router.js';
import { router as ChatRouter} from './Chat/chat.router.js'

export const Routes = [ 
    { path: API_CONSTANTS.TODO, router: TodoRouter },
    { path: API_CONSTANTS.USER, router: UserRouter },
    { path: API_CONSTANTS.UPLOAD, router: UploadRouter },
    { path: API_CONSTANTS.USERFUR, router: UserFurRouter },
    { path: API_CONSTANTS.SESSIONUSER, router: FurnitureRouter },
    { path: API_CONSTANTS.PRODUCTS, router: ProductsRouter },
    { path: API_CONSTANTS.PRODUCTS, router: ChatRouter },
];

