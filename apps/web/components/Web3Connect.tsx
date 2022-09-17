import * as React from 'react';
import { className_Icon } from '../utils/constants';
import ChainSelectPopover from './ChainSelectPopover';

function Web3Connect(props: {}) {
    const [chainSelectPopoverVisible, setChainSelectPopoverVisible] = React.useState(false);

    return <div className='flex flex-row-reverse grow-[100] items-center justify-self-start text-sm'>
        {/* reverse order */}
        <img src='help.svg' className={className_Icon} />
        <img src='/notification.svg' className={className_Icon} />

        <span className={`${className_Icon} border-l border-solid border-custom-gray`}/>

        <div className='flex flex-row rounded-lg bg-white border-white mr-8 items-center' >
            <span className='px-2'>0.001ETH</span>
            <span className='bg-primary-alt rounded-lg p-1.5 px-2'>0x1234...1234</span>
        </div>
        <div>
            <div onMouseOver={() => setChainSelectPopoverVisible(true)} onMouseLeave={() => setChainSelectPopoverVisible(false)} className='flex flex-row rounded-lg bg-white p-1.5 border-white mr-8' >
                <img src='/EthLogo.png' className='h-5 mr-2' />
                <img src='/down-arrow.svg' className='h-5' />
            </div>
            <div className={`absolute z-20 hover:visible ${chainSelectPopoverVisible ? 'visible' : 'invisible'}`}>
                <ChainSelectPopover />
            </div>
        </div>
    </div>
}

export default Web3Connect;
