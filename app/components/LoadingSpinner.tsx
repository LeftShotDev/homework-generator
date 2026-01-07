export default function LoadingSpinner() {
	return (
		<div className="fixed inset-0 bg-[#f4f3ef] bg-opacity-95 z-50 flex items-center justify-center">
			<div className="text-center">
				{/* Spinning animation */}
				<div className="relative w-24 h-24 mx-auto mb-6">
					<div className="absolute inset-0 border-8 border-[#15B976] border-t-transparent rounded-full animate-spin"></div>
					<div className="absolute inset-2 border-8 border-[#9c27b0] border-t-transparent rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }}></div>
				</div>

				{/* Text */}
				<h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">
					Generating Questions
				</h2>
				<p className="text-lg text-[#4a4a4a]">
					Please wait while we create your assessment...
				</p>

				{/* Pulsing dots */}
				<div className="flex justify-center gap-2 mt-6">
					<div className="w-3 h-3 bg-[#15B976] rounded-full animate-pulse" style={{ animationDelay: "0s" }}></div>
					<div className="w-3 h-3 bg-[#9c27b0] rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
					<div className="w-3 h-3 bg-[#15B976] rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
				</div>
			</div>
		</div>
	);
}
