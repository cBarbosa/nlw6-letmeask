import  {ButtonHTMLAttributes} from 'react'
import '../styles/button.scss';

export function Button({ isOutlined = false, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { isOutlined?: boolean }) {
    return (
        <button
            className={`button ${isOutlined ? 'outlined' : ''}`}
            {...props}
        />
    );
}
