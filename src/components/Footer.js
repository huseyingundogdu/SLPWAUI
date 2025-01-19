export default function Footer() {
    return (
        <footer className="w-full h-20 bg-primary text-white flex items-center justify-between px-6 fixed-bottom pt-3 pb-3">

            <div className="text-sm">
                &copy; {new Date().getFullYear()} YourCompany. All rights reserved.
            </div>
        </footer>
    );
}