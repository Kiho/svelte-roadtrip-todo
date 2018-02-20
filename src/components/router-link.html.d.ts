interface Router_linkOptions      { to?: string;
basePath?: string;
active?: string;
location?: string;
calssName?: string;
li?: boolean;
}
declare class Router_link extends ISvelte<Router_linkOptions>
{
    navigate: ($e: any, to: any) => void;
   setActivedClass: (location: any, to: any) => void;
}
export default Router_link