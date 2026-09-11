import SwiftUI

struct FoldableContentView: View {
    var body: some View {
        VStack(spacing: 16) {
            Text("Foldable Dashboard")
                .font(.title)
                // Anti-pattern: Fixed frame width prevents 7.6" canvas fluid expansion
                .frame(width: 390)
                .background(Color.blue)

            HStack {
                Text("Left Navigation")
                Spacer()
                Text("Content Area")
            }
            // Anti-pattern: Hardcoded height on container
            .frame(height: 844)
        }
    }
}
