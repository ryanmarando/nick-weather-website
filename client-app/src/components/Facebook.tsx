import { useEffect } from "react";

export default function FacebookEmbed() {
  useEffect(() => {
    if (!document.getElementById("facebook-jssdk")) {
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src =
        "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v16.0";
      script.async = true;
      document.body.appendChild(script);
    } else if ((window as any).FB) {
      (window as any).FB.XFBML.parse();
    }
  }, []);

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <div
        className="fb-page"
        data-href="https://www.facebook.com/NickDunnWX"
        data-tabs="timeline"
        data-width="340"
        data-height="500"
        data-small-header="false"
        data-adapt-container-width="true"
        data-hide-cover="false"
        data-show-facepile="true"
      ></div>
    </div>
  );
}
