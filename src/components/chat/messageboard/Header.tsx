import { PanelLeft } from 'lucide-react';
function Header() {
    return (
        <header className="bg-white h-full h-[72px]  rounded-tl-lg">
            <div className="flex items-center h-full">
                <div className=" relative before:content-[''] before:h-[24px] before:border-l-2 before:absolute before:top-1/2 before:left-14 before:bg-red-500 before:-translate-y-1/2">
                    <PanelLeft className="mt-2 mb-2 ml-4 mr-8 h-[36px] " />
                </div>

                <div>
                    <img
                        src="https://tse3.mm.bing.net/th/id/OIP.cGz8NopJvAgdkioxkugKoQHaHa?pid=Api&P=0&h=220"
                        alt="hình ảnh"
                        className="rounded-full object-cover w-10 m-2 h-[36px] "
                    />
                </div>
                <h3 className="m-2 h-[36px] text-[23px] font-semibold ">Nhóm Backend Dev</h3>
            </div>
        </header>
    );
}

export default Header;
