import * as React from 'react';

interface ITableInputDateTimeProps {
    onChange: (event: React.SyntheticEvent<HTMLElement>) => void;
    format: string;
    value: string;
    contentFormat?: string;
}

export default ITableInputDateTimeProps;
