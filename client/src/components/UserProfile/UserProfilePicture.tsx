import { FC, useContext, useEffect, useState } from "react";
import { AuthenticatedUserDataContext } from "../../contexts/UserContext";
import axios from "axios";
import { Buffer } from "buffer";
import { UserProfilePictureProps } from "../../types";
import { userProfilePicturePath } from "../../utils/dotenv";

export const UserProfilePicture: FC<UserProfilePictureProps> = ({
  userProfilePictureWidth,
  userProfilePictureHeight,
  userId,
}) => {
  const [imageUrl, setImageUrl] = useState<any>();
  // const authContext = useContext(AuthenticatedUserDataContext);
  // const { authenticatedUserDataState, authenticatedUserDataSetState } =
  //   authContext!;

  useEffect(() => {
    async function fetchProfilePicture() {
      try {
        const response = await axios(userProfilePicturePath, {
          responseType: "arraybuffer",
          params: { userId },
          withCredentials: true,
        });

        const base64String = Buffer.from(response.data, "binary").toString(
          "base64"
        );

        const imageUrl = `data:image/jpeg;base64,${base64String}`;

        setImageUrl(imageUrl);
      } catch (error) {
        console.log(error);
      }
    }
    fetchProfilePicture();
  }, [userId]);

  return (
    <div>
      {imageUrl ? (
        <img
          className={`${userProfilePictureWidth} ${userProfilePictureHeight} rounded-full`}
          src={imageUrl}
          alt="User Profile"
        />
      ) : (
        ""
        // <span>Loading image...</span>
        // <div>
        //   <span>{authenticatedUserDataState.userForename[0]}</span>
        //   <span>{authenticatedUserDataState.userSurname[0]}</span>
        // </div>
      )}
    </div>
  );
};
