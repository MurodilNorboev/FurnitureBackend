import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../../middleware/async-handler.middleware.js';
import { sendFile } from '../../utils/s3.js';
import { v4 } from 'uuid';
import path from 'path';

export const uploadFile = asyncHandler(async (req, res) => {
  const { image, image1, image2, image3, image4, checkImg } = req.files;
  
  const filePaths = [];
  
  const fileGroups = [image, image1, image2, image3, image4, checkImg];
  
  for (const fileGroup of fileGroups) {
    if (fileGroup) {
      for (const file of fileGroup) {
        if (!file || !file.buffer || !file.originalname) {
          continue; // Skip files that are not valid
        }

        const key = v4() + path.extname(file.originalname);
        const filePath = await sendFile(file.buffer, key);
        
        filePaths.push(filePath.startsWith('https://') ? filePath : `https://${filePath}`);
      }
    }
  }
  
  if (filePaths.length === 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      msg: 'At least one file is required.',
    });
  }
  
  res.status(StatusCodes.OK).json({ success: true, filePaths });
});
















// import { StatusCodes } from 'http-status-codes'
// import { asyncHandler } from '../../middleware/asynnc-handler.middleware.js'
// import { sendFile } from '../../utils/s3.js'
// import { v4 } from 'uuid'
// import path from 'path' 

// export const uploadFile = asyncHandler(async (req, res) => {
//     const { image, image1, image2, image3, image4, checkImg } = req.files;
  
//     const filePaths = [];
  
//     const fileGroups = [image, image1, image2, image3, image4, checkImg ];
//     for (const fileGroup of fileGroups) {
//       if (fileGroup) {
//         for (const file of fileGroup) {
//           const key = v4() + path.extname(file.originalname);
//           const filePath = await sendFile(file.buffer, key);
//           filePaths.push(filePath.startsWith('https://') ? filePath : `https://${filePath}`);
//         }
//       }
//     }
  
//     if (filePaths.length === 0) {
//       return res.status(400).json({
//         success: false,
//         msg: 'At least one image or image1 file is required',
//       });
//     }
  
//     res.status(200).json({ success: true, filePaths });
//   });
