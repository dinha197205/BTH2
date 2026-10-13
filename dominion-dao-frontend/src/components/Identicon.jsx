import { createAvatar } from "@dicebear/core";
import { identicon } from "@dicebear/collection";
import { useMemo } from "react";

const Identicon = ({ string = "", size = 40, className = "" }) => {
  const image = useMemo(() => {
    const avatar = createAvatar(identicon, {
      seed: string.toLowerCase(),
      size,
    });

    return avatar.toDataUri();
  }, [string, size]);

  return (
    <img
      src={image}
      width={size}
      height={size}
      className={className}
      alt="Wallet identicon"
    />
  );
};

export default Identicon;
