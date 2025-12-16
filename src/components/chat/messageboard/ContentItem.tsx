function ContentItem() {
    return (
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
    );
}

export default ContentItem;
