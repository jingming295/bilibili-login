
/**
 * @description 处理错误
 */
export class ErrorHandle
{
    /**
     * @description 处理错误
     * @param ErrorMsg 错误信息
     * @return string
     */
    ErrorHandle(ErrorMsg: string)
    {

        let returnMsg: string | null = null;
        ([{
            inc: ["Timeout"],
            fn: () =>
            {
                return `<>超时了</>`;
            }
        }]).some(o =>
        {
            if (o.inc.every(k => ErrorMsg.includes(k)))
            {
                returnMsg = o.fn();
                return true;
            }
            else
                return false;
        });

        if (!returnMsg)
        {
            console.log(`ErrorHandle: ${ErrorMsg}`);
            returnMsg === ErrorMsg;
            return ErrorMsg;
        }
        else
            return returnMsg;
    }
}