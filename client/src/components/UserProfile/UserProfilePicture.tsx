import { FC, useContext, useEffect, useState } from "react";
import { AuthenticatedUserDataContext } from "../../contexts/UserContext";
import axios from "axios";
import { Buffer } from "buffer";
import { UserProfilePictureProps } from "../../types";

export const UserProfilePicture: FC<UserProfilePictureProps> = ({ userId }) => {
  const [imageUrl, setImageUrl] = useState<any>();
  // const authContext = useContext(AuthenticatedUserDataContext);
  // const { authenticatedUserDataState, authenticatedUserDataSetState } =
  //   authContext!;

  useEffect(() => {
    async function fetchProfilePicture() {
      try {
        const response = await axios(
          "http://192.168.2.16:40587/api/user-profile-picture",
          {
            responseType: "arraybuffer",
            params: { userId },
            withCredentials: true,
          }
        );

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
          className="w-10 h-10 rounded-full"
          src={imageUrl}
          alt="User Profile"
        />
      ) : (
        <p>Loading image...</p>
        // <div>
        //   <span>{authenticatedUserDataState.userForename[0]}</span>
        //   <span>{authenticatedUserDataState.userSurname[0]}</span>
        // </div>
      )}
    </div>
  );
};
