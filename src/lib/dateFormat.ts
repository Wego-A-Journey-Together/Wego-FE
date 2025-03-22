import {format} from "date-fns";
import {ko} from "date-fns/locale";

/**
 * 날짜 형식 포메터 ( 댓글 부분 날짜 컴포넌트 )
 * 예시 : 2025.03.24 오후 8:45
 * @param date
 */
const dateFormat = ({date = new Date()}) => {
    const formattedDate = format(date, 'yyyy.MM.dd a h:mm', {locale: ko});

    return (
        formattedDate
    );
};

export default dateFormat;