function MainContent() {
    return (
        <section className="bg-[#f0f4fa] h-[calc(737.6px-72px-65px)]">
            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-200">
                <ul className="p-2">
                    <li>
                        <div className="flex">
                            <div className="pr-2">
                                <img
                                    src="https://tse3.mm.bing.net/th/id/OIP.cGz8NopJvAgdkioxkugKoQHaHa?pid=Api&P=0&h=220"
                                    alt="hình ảnh"
                                    className="rounded-full object-cover w-8 h-8 "
                                />
                            </div>
                            <div>
                                <div className="bg-white p-2 rounded-xl text-base">hello</div>
                                <div className="mt-1 text-xs">10:30</div>
                            </div>
                        </div>
                    </li>
                    <li className="mt-4">
                        <div className="flex flex-row-reverse">
                            <div className="pl-2">
                                <img
                                    src="https://tse3.mm.bing.net/th/id/OIP.cGz8NopJvAgdkioxkugKoQHaHa?pid=Api&P=0&h=220"
                                    alt="hình ảnh"
                                    className="rounded-full object-cover w-8 h-8 "
                                />
                            </div>
                            <div>
                                <div className="bg-[#883fdd] p-2 rounded-xl text-base text-white">hello</div>
                                <div className="mt-1 text-xs text-right">10:30</div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </section>
    );
}

export default MainContent;
