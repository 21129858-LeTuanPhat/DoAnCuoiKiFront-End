function ConversationItem({ user }: { user: any }) {
    return (
        <div className="w-full px-4 py-2 rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md hover:cursor-pointer flex">
            <img
                src="https://tse3.mm.bing.net/th/id/OIP.cGz8NopJvAgdkioxkugKoQHaHa?pid=Api&P=0&h=220"
                alt=""
                className="w-14 h-14 rounded-full object-cover"
            />
            <div className="ml-4 flex flex-col justify-center">
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">Hello, how are you?</p>
            </div>
        </div>
    );
}

export default ConversationItem;
