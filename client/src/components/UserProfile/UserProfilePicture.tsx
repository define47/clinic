import { FC, useContext, useEffect, useState } from "react";
import { AuthenticatedUserDataContext } from "../../contexts/UserContext";
import axios from "axios";
import { Buffer } from "buffer";

export const UserProfilePicture: FC = () => {
  const [imageUrl, setImageUrl] = useState<any>();
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState, authenticatedUserDataSetState } =
    authContext!;

  useEffect(() => {
    async function fetchProfilePicture() {
      try {
        const response = await axios(
          "http://192.168.2.16:40587/api/user-profile-picture",
          {
            responseType: "arraybuffer",
            params: { userId: authenticatedUserDataState.userId },
            withCredentials: true,
          }
        );

        console.log("herer,", response.data);

        const base64String = Buffer.from(response.data, "binary").toString(
          "base64"
        );
        console.log("🚀 ~ fetchProfilePicture ~ base64String:", base64String);
        const imageUrl = `data:image/jpeg;base64,${base64String}`;

        console.log("🚀 ~ fetchProfilePicture ~ imageUrl:", imageUrl);

        setImageUrl(imageUrl);
      } catch (error) {
        console.log(error);
      }
    }
    fetchProfilePicture();
  }, [authenticatedUserDataState]);

  useEffect(() => {
    console.log("imageUrl", imageUrl);
  }, [imageUrl]);

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
