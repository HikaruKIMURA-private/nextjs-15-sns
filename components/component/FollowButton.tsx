import { followAction } from "@/lib/actions";
import { Button } from "../ui/button";

const getButtonContent = (isFollowing: boolean, isCurrentUser: boolean) => {
  console.log(isFollowing, isCurrentUser);
  if (isCurrentUser) {
    return "プロフィール編集";
  }
  if (isFollowing) {
    return "フォロー中";
  }
  return "フォローする";
};

const getButtonVariant = (isFollowing: boolean, isCurrentUser: boolean) => {
  if (isCurrentUser) {
    return "secondary";
  }
  if (isFollowing) {
    return "outline";
  }
  return "default";
};

const FollowButton = ({
  isFollowing,
  isCurrentUser,
  userId,
}: {
  isFollowing: boolean;
  isCurrentUser: boolean;
  userId: string;
}) => {
  return (
    <form action={followAction.bind(null, userId)}>
      <Button
        variant={getButtonVariant(isFollowing, isCurrentUser)}
        className="w-full"
      >
        {getButtonContent(isFollowing, isCurrentUser)}
      </Button>
    </form>
  );
};

export default FollowButton;
