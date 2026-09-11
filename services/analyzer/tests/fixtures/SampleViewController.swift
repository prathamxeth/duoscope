import UIKit

class SampleViewController: UIViewController {
    private let headerView = UIView()
    private let actionButton = UIButton(type: .system)

    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Anti-pattern 1: Direct UIScreen.main.bounds access
        let screenWidth = UIScreen.main.bounds.width
        let screenHeight = UIScreen.main.bounds.height
        
        // Anti-pattern 2: Hardcoded fixed screen width (390pt) and height (844pt)
        headerView.frame = CGRect(x: 0, y: 0, width: 390, height: 120)
        actionButton.frame = CGRect(x: 20, y: 844 - 80, width: 350, height: 50)
        
        // Anti-pattern 3: Deprecated status bar orientation
        let orientation = UIApplication.shared.statusBarOrientation
        print("Current orientation: \(orientation.rawValue)")
        
        view.addSubview(headerView)
        view.addSubview(actionButton)
    }

    override func viewWillTransition(to size: CGSize, with coordinator: UIViewControllerTransitionCoordinator) {
        super.viewWillTransition(to: size, with: coordinator)
        // Correctly handle transition or anti-pattern
    }
}
