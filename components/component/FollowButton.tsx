import { Button } from "../ui/button";

const getButtonContent = (isFollowing: boolean, isCurrentUser: boolean) => {
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
}: {
  isFollowing: boolean;
  isCurrentUser: boolean;
}) => {
  return (
    <div>
      <Button
        variant={getButtonVariant(isFollowing, isCurrentUser)}
        className="w-full"
      >
        {getButtonContent(isFollowing, isCurrentUser)}
      </Button>
    </div>
  );
};

export default FollowButton;
